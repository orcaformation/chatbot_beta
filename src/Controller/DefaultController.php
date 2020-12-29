<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\LmsRefCulture;
use App\Service\UserService;

class DefaultController extends AbstractController
{
    /**
     * @Route("/", name="default")
     */
    public function DefaultAction()
    {
        return $this->render('index.html.twig');
    }
}
